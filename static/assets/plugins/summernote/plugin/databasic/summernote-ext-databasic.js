 = $(rng.sc).closest('data.ext-databasic');
      
        if ($data.length)
        {
          var pos = dom.posFromPlaceholder($data[0]);
          
          self.$popover.css({
            display: 'block',
            left: pos.left,
            top: pos.top
          });
          
          // save editor target to let size buttons resize the container
          context.invoke('editor.saveTarget', $data[0]);

          visible = true;
        }

      }
      
      // hide if not visible
      if (!visible) {
        self.hidePopover();
      }

    };

    self.hidePopover = function () {
      self.$popover.hide();
    };

    // define plugin dialog
    self.getInfo = function () {
      var rng = context.invoke('editor.createRange');
      
      if (rng.isOnData())
      {
        var $data = $(rng.sc).closest('data.ext-databasic');
      
        if ($data.length)
        {
          // Get the first node on range(for edit).
          return {
            node: $data,
            test: $data.attr('data-test')
          };
        }
      }
      
      return {};
    };

    self.setContent = function ($node) {
      $node.html('<p contenteditable="false">' + self.icon + ' ' + lang.databasic.name + ': ' +
        $node.attr('data-test') + '</p>');
    };

    self.updateNode = function (info) {
      self.setContent(info.node
        .attr('data-test', info.test));
    };

    self.createNode = function (info) {
      var $node = $('<data class="ext-databasic"></data>');

      if ($node) {
        // save node to info structure
        info.node = $node;
        // insert node into editor dom
        context.invoke('editor.insertNode', $node[0]);
      }

      return $node;
    };
    
    self.showDialog = function () {
      var info = self.getInfo();
      var newNode = !info.node;
      context.invoke('editor.saveRange');
      
      self
        .openDialog(info)
        .then(function (dialogInfo) {
          // [workaround] hide dialog before restore range for IE range focus
          ui.hideDialog(self.$dialog);
          context.invoke('editor.restoreRange');
          
          // insert a new node
          if (newNode)
          {
            self.createNode(info);
          }
          
          // update info with dialog info
          $.extend(info, dialogInfo);
          
          self.updateNode(info);
        })
        .fail(function () {
          context.invoke('editor.restoreRange');
        });

    };
    
    self.openDialog = function (info) {
      return $.Deferred(function (deferred) {
        var $inpTest = self.$dialog.find('.ext-databasic-test');
        var $saveBtn = self.$dialog.find('.ext-databasic-save');
        var onKeyup = function (event) {
            if (event.keyCode === 13)
            {
              $saveBtn.trigger('click');
            }
          };
        
        ui.onDialogShown(self.$dialog, function () {
          context.triggerEvent('dialog.shown');

          $inpTest.val(info.test).on('input', function () {
            ui.toggleBtn($saveBtn, $inpTest.val());
          }).trigger('focus').on('keyup', onKeyup);

          $saveBtn
            .text(info.node ? lang.databasic.edit : lang.databasic.insert)
            .click(function (event) {
              event.preventDefault();

              deferred.resolve({ test: $inpTest.val() });
            });
          
          // init save button
          ui.toggleBtn($saveBtn, $inpTest.val());
        });

        ui.onDialogHidden(self.$dialog, function () {
          $inpTest.off('input keyup');
          $saveBtn.off('click');

          if (deferred.state() === 'pending') {
            deferred.reject();
          }
        });

        ui.showDialog(self.$dialog);
      });
    };
  };

  // Extends summernote
  $.extend(true, $.summernote, {
    plugins: {
      databasic: DataBasicPlugin
    },
    
    options: {
      popover: {
        databasic: [
          ['databasic', ['databasicDialog', 'databasicSize100', 'databasicSize50', 'databasicSize25']]
        ]
      }
    },
    
    // add localization texts
    lang: {
      'en-US': {
        databasic: {
          name: 'Basic Data Container',
          insert: 'insert basic data container',
          edit: 'edit basic data container',
          testLabel: 'test input'
        }
      }
    }
    
  });

}));
